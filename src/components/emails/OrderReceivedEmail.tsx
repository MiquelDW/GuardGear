import { ShippingAddress } from "@prisma/client";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export default function OrderReceivedEmail({
  shippingAddress,
  orderId,
  orderDate,
}: {
  shippingAddress: ShippingAddress;
  orderId: string;
  orderDate: string;
}) {
  // retrieve base url dependending on which environment the user is in
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://guardgear.vercel.app";

  return (
    // a React html component to wrap emails
    <Html>
      {/* contains head components, related to the document such as style and meta elements */}
      <Head />

      {/* text that will be displayed in the inbox of the recipient */}
      <Preview>Your order summary and estimated delivery date</Preview>

      {/* Contains main body of the email */}
      <Body style={main}>
        {/* Layout component that centers all the email content */}
        <Container style={container}>
          {/* Display a section */}
          <Section style={message}>
            <Img
              src={`${baseUrl}/snake-3.png`}
              width="65"
              height="73"
              alt="delivery snake"
              style={{ margin: "auto" }}
            />
            <Heading style={global.heading}>Thank you for your order!</Heading>

            <Text style={global.text}>
              We're preparing everything for delivery and will notify you once
              your package has been shipped. Delivery usually takes 2 days.
            </Text>

            <Text style={{ ...global.text, marginTop: 24 }}>
              If you have any questions regarding your order, please feel free
              to contact us with your order number and we're here to help.
            </Text>
          </Section>

          <Hr style={global.hr} />

          {/* Display a section */}
          <Section style={global.defaultPadding}>
            <Text style={addressTitle}>
              Shipping to: {shippingAddress.name}
            </Text>
            <Text style={{ ...global.text, fontSize: 14 }}>
              {shippingAddress.street}, {shippingAddress.city},{" "}
              {shippingAddress.state} {shippingAddress.postalCode}
            </Text>
          </Section>

          <Hr style={global.hr} />

          {/* Display a section that's formatted using columns in a single row */}
          <Section style={global.defaultPadding}>
            <Row style={{ display: "inline-flex gap-16", marginBottom: 40 }}>
              <Column style={{ width: 170 }}>
                <Text style={global.paragraphWithBold}>Order Number</Text>
                <Text style={track.number}>{orderId}</Text>
              </Column>

              <Column style={{ marginLeft: 20 }}>
                <Text style={global.paragraphWithBold}>Order Date</Text>
                <Text style={track.number}>{orderDate}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={global.hr} />

          {/* Display a section that's formatted using rows */}
          <Section style={paddingY}>
            <Row>
              <Text
                style={{ ...footer.text, paddingTop: 30, paddingBottom: 30 }}
              >
                Please contact us if you have any questions. (If you reply to
                this email, we won't be able to see it.)
              </Text>
            </Row>

            <Row>
              <Text style={footer.text}>
                © GuardGear, Inc. All Rights Reserved.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const paddingX = {
  paddingLeft: "40px",
  paddingRight: "40px",
};

const paddingY = {
  paddingTop: "22px",
  paddingBottom: "22px",
};

const paragraph = {
  margin: "0",
  lineHeight: "2",
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: "bold" },
  heading: {
    fontSize: "32px",
    lineHeight: "1.3",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: "-1px",
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: "#747474",
    fontWeight: "500",
  },
  button: {
    border: "1px solid #929292",
    fontSize: "16px",
    textDecoration: "none",
    padding: "10px 0px",
    width: "220px",
    display: "block",
    textAlign: "center",
    fontWeight: "500",
    color: "#000",
  } as React.CSSProperties,
  hr: {
    borderColor: "#E5E5E5",
    margin: "0",
  },
};

const track = {
  container: {
    padding: "22px 40px",
    backgroundColor: "#F7F7F7",
  },
  number: {
    margin: "12px 0 0 0",
    fontWeight: 500,
    lineHeight: "1.4",
    color: "#6F6F6F",
  },
};

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "10px auto",
  width: "600px",
  maxWidth: "100%",
  border: "1px solid #E5E5E5",
};

const message = {
  padding: "40px 74px",
  textAlign: "center",
} as React.CSSProperties;

const addressTitle = {
  ...paragraph,
  fontSize: "15px",
  fontWeight: "bold",
};

const footer = {
  policy: {
    width: "166px",
    margin: "auto",
  },
  text: {
    margin: "0",
    color: "#AFAFAF",
    fontSize: "13px",
    textAlign: "center",
  } as React.CSSProperties,
};
