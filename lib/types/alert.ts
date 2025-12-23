export type AlertVariant = "default" | "destructive" | "success" | "info";

export interface Alert {
  variant: AlertVariant;
  title: string;
  description?: string;
}
