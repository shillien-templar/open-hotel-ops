import { SigninForm } from "@/components/signin-form";
import Container from "@/components/container";
import {Section} from "@/components/ui/section";

export default function SignInPage() {
  return (
    <Section>
        <Container size="xxs">
            <SigninForm />
        </Container>
    </Section>
  );
}
