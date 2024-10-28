import ClaimsTable from "~/components/ClaimsTable";
import FileUpload from "~/components/FileUpload";


export default function MainPage() {

  return (
    <>
      <div className="flex h-full items-center justify-center text-center">
        <div className="space-y-2">
          <FileUpload />
          <ClaimsTable />
        </div>
      </div>
    </>
  );
}
