import { LoginForm } from "@/components/login-form";
import Container from "@/components/container";

export default function SignInPage() {
  return (
    <section className="my-12">
        <Container size="xxs">
            <LoginForm />
        </Container>
    </section>
  );
}
