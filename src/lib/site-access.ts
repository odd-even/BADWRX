export interface SiteAccessSettings {
  passwordProtectionEnabled: boolean;
  ageVerificationEnabled: boolean;
  previewPassword: string;
}

export const defaultSiteAccess: SiteAccessSettings = {
  passwordProtectionEnabled: true,
  ageVerificationEnabled: true,
  previewPassword: "badwrx",
};

export function normalizeSiteAccess(
  raw: Partial<SiteAccessSettings> | null | undefined,
): SiteAccessSettings {
  return {
    passwordProtectionEnabled:
      raw?.passwordProtectionEnabled ??
      defaultSiteAccess.passwordProtectionEnabled,
    ageVerificationEnabled:
      raw?.ageVerificationEnabled ?? defaultSiteAccess.ageVerificationEnabled,
    previewPassword:
      raw?.previewPassword?.trim() || defaultSiteAccess.previewPassword,
  };
}
