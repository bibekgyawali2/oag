'use client'
import RecordForm from "@/component/form";
import { withAuth } from "@/lib/withAuths";

function Home() {
  return (
    <>
      <RecordForm />
    </>
  );
}
export default withAuth(Home);