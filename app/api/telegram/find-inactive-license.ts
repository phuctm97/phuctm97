import { listLicenseKeys } from "@lemonsqueezy/lemonsqueezy.js";

export async function findInactiveLicense(
  email: string,
): Promise<string | undefined> {
  const pageSize = 100;
  let pageNumber = 1;
  let foundLicense;

  while (!foundLicense) {
    const pagePromises = Array.from({ length: 10 }, (_, index) =>
      listLicenseKeys({
        page: {
          size: pageSize,
          number: pageNumber + index,
        },
      }),
    );

    const results = await Promise.all(pagePromises);

    for (const result of results) {
      if (!result.data?.data.length) return;

      foundLicense = result.data.data.find(
        (license) =>
          license.attributes.user_email === email &&
          license.attributes.status === "inactive",
      );

      if (foundLicense) break;
    }

    if (!foundLicense) pageNumber += 10;
  }

  return foundLicense.attributes.key;
}
