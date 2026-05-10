import { z } from "zod";

export const newsletterSignupSchema = z.object({
  title: z.string().default("Stay in the loop"),
  subtext: z
    .string()
    .default("Get early access to new arrivals and exclusive offers."),
  buttonLabel: z.string().default("Subscribe"),
  placeholder: z.string().default("Enter your email"),
  /** Tag stored on each signup so admin can correlate to where it came from. */
  source: z.string().default("homepage-newsletter"),
  /** Optional background image for the centered-banner variant. */
  backgroundImageUrl: z.string().default(""),
});

export type NewsletterSignupProps = z.infer<typeof newsletterSignupSchema>;

export const newsletterSignupDefaults = (): NewsletterSignupProps => ({
  title: "Stay in the loop",
  subtext: "Get early access to new arrivals and exclusive offers.",
  buttonLabel: "Subscribe",
  placeholder: "Enter your email",
  source: "homepage-newsletter",
  backgroundImageUrl: "",
});
