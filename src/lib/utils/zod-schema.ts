import { z } from "zod";

export const tjmSchema = z
  .number({ invalid_type_error: "Le TJM est obligatoire." })
  .nonnegative("Le TJM doit être positif.");

export const percentageSchema = z
  .number({ invalid_type_error: "Le pourcentage est obligatoire." })
  .positive("Le pourcentage doit être positif.")
  .max(100, "Le pourcentage doit être inférieur à 100.");

export const expensesSchema = z.number().nonnegative("Le minimum de frais est de 0€.").optional().default(0);
