import Leaves from "../invite/leaves";

export default function SuccessLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Leaves />
            {children}
        </div>
    );
}
