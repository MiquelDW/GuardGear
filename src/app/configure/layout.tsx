import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Steps from "@/components/Steps";

// Layout Component that wraps around all files inside folder 'configure'
// it ensures a consistent layout for all pages and routes within the folder 'configure'
// this Layout component will be given to the Root Layout component as a child
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MaxWidthWrapper className="flex flex-1 flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
}
