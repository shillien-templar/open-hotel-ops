# Technical Overview

## Stack
- Next.js 16 with App Router
- TypeScript
- Prisma 7 + PostgreSQL
- Auth.js v5
- Shadcn UI + Tailwind CSS

## Core Entities

### User Roles (Hierarchy)
- Super Admin (only one allowed)
  - Can create Admin users
- Admin
  - Can create Front Desk and Housekeeping users
- Front Desk
- Housekeeping

### Room States
- Vacant
- Booked
- Occupied
- Checked Out

### Guest Presence
- In Room
- Out
- Unknown

## Data Model
- Users with role-based access
- Customers with contact information
- Rooms with status and guest presence tracking
- Auth tables for session management

## Architecture Conventions

### Component Strategy
- All pages are server components by default
- Client components are created only when needed (interactivity, hooks, etc.)

### Form System

The application uses a registry-based form system that separates concerns between client and server, with universal field rendering and centralized validation.

#### Architecture Overview

**Registry Pattern:**
- Forms are defined in `lib/forms/definitions/{form-name}/`
- Client-safe configs registered in `lib/forms/core/registry.ts`
- Server-only configs (validations, actions) registered in `lib/forms/core/server-registry.ts`
- Component registry at `components/forms/registry.ts` maps form IDs to field layout components

**Two Types of Forms:**
1. **Registry-based forms** - Use `FormRenderer` component with centralized field definitions
2. **Custom forms** - Direct use of react-hook-form (e.g., `SigninForm`)

#### Creating a Registry-Based Form

**1. Define Form Structure** (`lib/forms/definitions/{form-name}/`)

```
{form-name}/
├── index.ts          # Exports FormConfig (fields + schema)
├── fields.ts         # Field definitions with types, labels, validation
├── schema.ts         # Zod schema for form validation
├── server.ts         # Server-side data validation (optional)
└── action.ts         # Form submission action
```

**2. Field Definitions** (`fields.ts`)
```typescript
export const fields = {
  email: {
    type: "text",
    label: "Email",
    placeholder: "user@example.com",
    defaultValue: "",
    schema: z.string().email("Invalid email"),
  },
  password: {
    type: "password",
    label: "Password",
    placeholder: "Enter password",
    defaultValue: "",
    schema: z.string().min(8, "Min 8 characters"),
  },
} as const satisfies FormFields;
```

**Supported Field Types:**
- `text`, `password`, `textarea`
- `number`, `slider` (with min/max/step)
- `select`, `radio` (with options array)
- `file` (with validation rules)
- `hidden`

**3. Schema Definition** (`schema.ts`)
```typescript
export const schema = z.object({
  email: fields.email.schema,
  password: fields.password.schema,
}).refine(/* cross-field validation */, { /* error config */ });
```

**4. Server Configuration** (`server.ts` and `action.ts`)
```typescript
// server.ts - Data validation (Type 2)
export const dataValidation = {
  secret: async (value: string) => {
    if (value !== process.env.SETUP_SECRET) {
      return "Invalid setup secret";
    }
    return null; // Valid
  },
};

// action.ts - Form submission handler
export async function action(formData: FormData | Record<string, unknown>) {
  // Business logic
  return {
    status: "success",
    alert: { variant: "success", title: "Success!" },
  };
}
```

**5. Register the Form**

```typescript
// lib/forms/core/registry.ts
export const formRegistry = {
  "my-form": myFormConfig,
};

// lib/forms/core/server-registry.ts
export const serverRegistry = {
  "my-form": {
    dataValidation: myFormDataValidation,
    action: myFormAction,
  },
};
```

**6. Create Field Layout Component** (`components/forms/my-form.tsx`)
```typescript
export function MyFormFields({ form }: { form: UseFormReturn<any> }) {
  const config = getFormConfig("my-form");
  return (
    <FieldGroup>
      <FieldRenderer name="email" id="email" fieldConfig={config.fields.email} form={form} />
      <FieldRenderer name="password" id="password" fieldConfig={config.fields.password} form={form} />
    </FieldGroup>
  );
}

// Register in components/forms/registry.ts
export const formComponentRegistry = {
  "my-form": MyFormFields,
};
```

**7. Use in Page**
```typescript
<FormRenderer
  formId="my-form"
  submitButtonText="Submit"
  onSuccess={(result) => { /* handle success */ }}
/>
```

#### Validation Flow

**Type 1: Schema Validation** (runs client + server)
- Validates data types, formats, required fields
- Defined in field schemas, combined in form schema
- Cross-field validation via `.refine()` on schema

**Type 2: Data Validation** (runs server-only)
- Validates against actual data (env vars, database, etc.)
- Defined in `server.ts` dataValidation object
- Returns error message or null

**Processing Flow:**
1. Client validates schema → submits to `/api/forms/{formId}`
2. Server validates schema (Type 1)
3. Server validates data (Type 2)
4. Server executes action (business logic)
5. Returns result with alert/fieldErrors to client

#### Field Rendering

**FieldRenderer Component:**
- Universal component that renders any field type
- Uses `react-hook-form` Controller for form integration
- Automatically shows labels, descriptions, errors
- Maps field type to appropriate UI component (Input, Textarea, Select, etc.)

**Supported Field Features:**
- Automatic validation error display
- Server-side error binding to specific fields
- Custom variants (e.g., model-dialog for selects, stepper for numbers)
- Rich metadata support (pricing, dimensions, etc.)

#### Form Responses

**Success Response:**
```typescript
{
  status: "success",
  alert: {
    variant: "success",
    title: "Success",
    description: "Optional description"
  }
}
```

**Error Response:**
```typescript
{
  status: "fail",
  alert: {
    variant: "destructive",
    title: "Error",
    description: "Error message"
  },
  fieldErrors: {
    email: "This email already exists"
  }
}
```

#### Best Practices

- Use registry-based forms for consistency and reusability
- Keep field schemas DRY by extracting to field definitions
- Use Type 2 validation for database/environment checks
- Server actions should return standardized alert objects
- Field components registered in component registry for modularity
- All forms must be registered in both client and server registries

### Initial Setup
- First-time setup requires SETUP_SECRET env variable
- Creates initial admin account
- Setup page checks if admin exists
- After admin creation, SETUP_SECRET must be removed for security
