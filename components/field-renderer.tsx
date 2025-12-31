import type {FieldConfig} from '@/types/forms'
import type {UseFormReturn, ControllerRenderProps, ControllerFieldState} from 'react-hook-form'
import {Controller} from 'react-hook-form'
import {Field, FieldLabel, FieldDescription, FieldError} from '@/components/ui/field'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import {Wand2} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

function generatePassword(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
}

interface FieldRendererProps {
    name: string
    id: string
    fieldConfig: FieldConfig
    form: UseFormReturn<Record<string, unknown>>
}

/**
 * Universal Field Renderer
 * Automatically renders the appropriate UI component based on field type
 * Uses new Field pattern with Controller from react-hook-form
 */
export function FieldRenderer({name, id, fieldConfig, form}: FieldRendererProps) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({field, fieldState}) => (
                <Field
                    data-invalid={fieldState.invalid}
                    className={fieldConfig.type === 'hidden' ? 'hidden' : fieldConfig.className}
                >
                    <FieldLabel htmlFor={id}>{fieldConfig.label}</FieldLabel>
                    {renderFieldControl(fieldConfig, field, fieldState, id)}
                    {fieldConfig.description && (
                        <FieldDescription>{fieldConfig.description}</FieldDescription>
                    )}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
            )}
        />
    )
}

function renderFieldControl(
    fieldConfig: FieldConfig,
    field: ControllerRenderProps<Record<string, unknown>, string>,
    fieldState: ControllerFieldState,
    id: string
) {
    switch (fieldConfig.type) {
        case 'text':
            return (
                <Input
                    {...field}
                    value={field.value as string}
                    id={id}
                    aria-invalid={fieldState.invalid}
                    type="text"
                    placeholder={fieldConfig.placeholder}
                />
            )

        case 'password':
            return (
                <Input
                    {...field}
                    value={field.value as string}
                    id={id}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder={fieldConfig.placeholder}
                />
            )

        case 'password-generate':
            return (
                <div className="flex gap-2">
                    <Input
                        {...field}
                        value={field.value as string}
                        id={id}
                        aria-invalid={fieldState.invalid}
                        type="text"
                        placeholder={fieldConfig.placeholder}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => field.onChange(generatePassword())}
                        title="Generate password"
                    >
                        <Wand2 className="h-4 w-4" />
                    </Button>
                </div>
            )

        case 'textarea':
            return (
                <Textarea
                    {...field}
                    value={field.value as string}
                    id={id}
                    aria-invalid={fieldState.invalid}
                    placeholder={fieldConfig.placeholder}
                    rows={4}
                    className="max-w-full w-full"
                />
            )

        case 'number':
            // Default number input
            return (
                <Input
                    {...field}
                    value={field.value as number}
                    id={id}
                    aria-invalid={fieldState.invalid}
                    type="number"
                    min={fieldConfig.min}
                    max={fieldConfig.max}
                    step={fieldConfig.step}
                />
            )

        case 'select':
            // Default select dropdown
            return (
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                >
                    <SelectTrigger
                        className="w-full"
                        id={id}
                        aria-invalid={fieldState.invalid}
                    >
                        <SelectValue placeholder={`Select ${fieldConfig.label.toLowerCase()}`}/>
                    </SelectTrigger>
                    <SelectContent>
                        {fieldConfig.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                <div>
                                    <div>{opt.label}</div>
                                    {opt.description && (
                                        <div className="text-xs text-muted-foreground">
                                            {opt.description}
                                        </div>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

        case 'radio':
            // Radio groups can be implemented similar to select
            return (
                <div className="text-sm text-muted-foreground">
                    Radio component not yet implemented
                </div>
            )

        case 'hidden':
            return (
                <Input
                    {...field}
                    value={field.value as string}
                    id={id}
                    type="hidden"
                />
            )

        default:
            return (
                <div className="text-sm text-destructive">
                    Unsupported field type
                </div>
            )
    }
}
