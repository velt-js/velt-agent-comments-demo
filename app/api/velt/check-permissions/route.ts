// [Velt] Real-time Permission Provider endpoint (PRODUCTION path).
//
// Velt's servers POST here whenever a user touches a resource (organization,
// folder, document, or context). We reply with whether each request has
// access. Docs: https://docs.velt.dev/key-concepts/overview#c-real-time-permission-provider
//
// In local development this endpoint is NOT used: the browser resolves
// permissions via permissionProvider.resolvePermissions (see app/page.tsx),
// which only works on dev/test API keys. In production the dev resolver is
// ignored by Velt's backend, so this endpoint must be deployed to a public
// HTTPS URL and registered in the Velt Console:
//   https://console.velt.dev/dashboard/config/permission-provider
//
// Both paths share the same policy in components/velt/permissions.ts and the
// request/response envelope is byte-identical, so this handler works unchanged
// whether it's called by Velt's servers or (optionally) the browser.
//
// Setup:
//   1. Deploy this app and set the public URL of this endpoint in the Console.
//   2. (Optional) Set an auth token in the Console and the matching value in
//      VELT_PERMISSION_PROVIDER_TOKEN. If unset, the auth check is skipped.

import type { NextRequest } from "next/server";
import type { PermissionQuery } from "@veltdev/types";
import { evaluatePermission } from "@/components/velt/permissions";

interface VeltPermissionRequestBody {
  data?: { requests?: PermissionQuery[] };
}

function unauthorized() {
  return Response.json(
    {
      data: [],
      success: false,
      statusCode: 401,
      message: "Unauthorized",
    },
    { status: 401 },
  );
}

function badRequest(message: string) {
  return Response.json(
    {
      data: [],
      success: false,
      statusCode: 400,
      message,
    },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.VELT_PERMISSION_PROVIDER_TOKEN;
  if (expectedToken) {
    const header = request.headers.get("authorization") ?? "";
    const provided = header.startsWith("Bearer ")
      ? header.slice("Bearer ".length).trim()
      : "";
    if (provided !== expectedToken) return unauthorized();
  }

  let body: VeltPermissionRequestBody;
  try {
    body = (await request.json()) as VeltPermissionRequestBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const requests = body?.data?.requests;
  if (!Array.isArray(requests)) {
    return badRequest("Missing data.requests array");
  }

  const data = requests.map(evaluatePermission);

  return Response.json({
    data,
    success: true,
    statusCode: 200,
    message: "Permissions validated successfully",
  });
}
