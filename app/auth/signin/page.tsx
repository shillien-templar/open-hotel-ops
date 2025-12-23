import { LoginForm } from "@/components/login-form";
import Container from "@/components/container";
import {Section} from "@/components/ui/section";

export default function SignInPage() {
  return (
    <Section>
        <Container size="xxs">
            <LoginForm />
        </Container>
    </Section>
  );
}
