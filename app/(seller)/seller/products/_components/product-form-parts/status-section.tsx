import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

import {
  GET_MY_PRODUCTS,
  REMOVE_MY_PRODUCT,
  SET_MY_PRODUCT_STATUS,
} from "@/lib/graphql/products";
import {
  Product,
  PRODUCT_STATUS_LABEL,
  ProductStatus,
  RemoveMyProductData,
  SetMyProductStatusData,
} from "@/types/product.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Status card (edit-only) — DRAFT / ACTIVE / INACTIVE toggle plus a danger-zone
 * delete for DRAFT/ARCHIVED products. Owns its own status + delete mutations and
 * the delete-confirmation dialog so the orchestrator stays lean.
 */
export function StatusSection({ product }: { product: Product }) {
  const router = useRouter();

  const [setStatus, { loading: settingStatus }] =
    useMutation<SetMyProductStatusData>(SET_MY_PRODUCT_STATUS);

  const [removeMyProduct, { loading: removing }] = useMutation<RemoveMyProductData>(
    REMOVE_MY_PRODUCT,
    {
      refetchQueries: [{ query: GET_MY_PRODUCTS, variables: { status: null } }],
    },
  );

  const [deletingDialog, setDeletingDialog] = useState(false);

  async function handleStatusChange(next: ProductStatus) {
    try {
      await setStatus({
        variables: {
          setProductStatusInput: { id: product.id, status: next },
        },
      });
      toast.success(`Status → ${PRODUCT_STATUS_LABEL[next]}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Status change failed";
      toast.error(msg);
    }
  }

  async function handleDelete() {
    try {
      await removeMyProduct({ variables: { id: product.id } });
      toast.success("Product deleted");
      router.push("/seller/products");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            {(["DRAFT", "ACTIVE", "INACTIVE"] as const).map((s) => (
              <Button
                key={s}
                type="button"
                variant={product.status === s ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange(s)}
                disabled={settingStatus}
              >
                {PRODUCT_STATUS_LABEL[s]}
              </Button>
            ))}
            {product.status === "ARCHIVED" && (
              <Badge variant="destructive">Archived (admin only)</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            ACTIVE makes the product visible on your storefront. Requires ≥1
            image and price &gt; 0.
          </p>

          {(product.status === "DRAFT" || product.status === "ARCHIVED") && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-destructive mb-2">
                Danger zone
              </p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setDeletingDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete this product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirm dialog */}
      <AlertDialog
        open={deletingDialog}
        onOpenChange={(o) => !o && setDeletingDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              Soft-delete &ldquo;{product.name}&rdquo;? The record stays in the
              database with a deletion timestamp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={removing}
            >
              {removing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
