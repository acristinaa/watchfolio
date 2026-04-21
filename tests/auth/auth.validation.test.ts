import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.email).toBeDefined();
  });

  it("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });
});

describe("signupSchema", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "Password1",
      confirmPassword: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password without uppercase", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password1",
      confirmPassword: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "Password1",
      confirmPassword: "Password2",
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.confirmPassword).toBeDefined();
  });

  it("rejects password without a number", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "PasswordOnly",
      confirmPassword: "PasswordOnly",
    });
    expect(result.success).toBe(false);
  });
});
