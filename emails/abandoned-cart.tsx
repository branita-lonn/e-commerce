import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AbandonedCartEmailProps {
  customerName: string;
  recoveryUrl: string;
  items: { name: string; quantity: number; price: number }[];
}

export const AbandonedCartEmail = ({
  customerName = "Valued Customer",
  recoveryUrl = "https://miduka.com/cart",
  items = [
    { name: "Sample Product", quantity: 1, price: 1000 },
  ],
}: AbandonedCartEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You left some items in your cart! 🛍️</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Did you forget something?</Heading>
          
          <Text style={text}>Hi {customerName.split(" ")[0]},</Text>
          <Text style={text}>
            We noticed you left some items in your cart. They're still waiting for you, but they won't stay there forever!
          </Text>

          <Section style={section}>
            <Text style={strong}>In your cart:</Text>
            {items.map((item, i) => (
              <Section key={i} style={{ marginBottom: '8px' }}>
                <Text style={{ ...text, margin: 0 }}>
                  {item.name} <span style={{ color: '#888' }}>x {item.quantity}</span>
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={buttonContainer}>
            <a href={recoveryUrl} style={button}>
              Complete My Purchase
            </a>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            If you have any questions, just reply to this email. We're here to help!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AbandonedCartEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "700",
  lineHeight: "32px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const strong = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "12px",
  display: "block",
};

const section = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "24px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1.5",
  padding: "12px 24px",
  textDecoration: "none",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
};
