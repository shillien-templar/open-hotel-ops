export default function Container({
    children,
    size = "default"
}: {
    children: React.ReactNode
    size?: "default" | "wide" | "sm" | "xs" | "xxs" | "fluid"
}) {
    const containerClass = {
        default: "max-w-[1280px]",
        wide: "max-w-[1440px]",
        sm: "max-w-[1024px]",
        xs: "max-w-[640px]",
        xxs: "max-w-[480px]",
        fluid: "w-full"
    }

    return (
        <div className={`${containerClass[size] || containerClass.default} mx-auto px-4`}>
            {children}
        </div>
    )
}
