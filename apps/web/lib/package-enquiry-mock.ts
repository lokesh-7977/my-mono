// TEMPORARY: there is no enquiry endpoint yet — see
// apps/docs/checklists/package/package-enquiry-checklist.md. This pretends to submit so
// the modal's success state can be built and reviewed; nothing is sent anywhere.
//
// Swap-out plan: once the endpoint exists, replace the body of submitPackageEnquiry with a
// call to it (add a module under api/ following the api/<module> layout). The modal only
// depends on this function's signature, and treats a rejected promise as a failed submit.
export interface PackageEnquiryInput {
  packageId: string;
  firstName: string;
  email: string;
  phone: string;
  message: string;
}

export async function submitPackageEnquiry(input: PackageEnquiryInput): Promise<void> {
  void input;
  await new Promise((resolve) => setTimeout(resolve, 700));
}
