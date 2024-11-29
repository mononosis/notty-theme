import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { EyeOff, Eye } from 'lucide-react'


export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes
  });

  const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

  const { msg, msgStr } = i18n;

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError("username", "password")}
      headerNode={msg("loginAccountTitle")}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <div id="kc-registration-container">
          <div id="kc-registration">
            <span>
              {msg("noAccount")}{" "}
              <a tabIndex={8} href={url.registrationUrl}>
                {msg("doRegister")}
              </a>
            </span>
          </div>
        </div>
      }
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
              <hr />
              <h2>{msg("identity-provider-login-label")}</h2>
              <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                {social.providers.map((...[p, , providers]) => (
                  <li key={p.alias}>
                    <a
                      id={`social-${p.alias}`}
                      className={kcClsx(
                        "kcFormSocialAccountListButtonClass",
                        providers.length > 3 && "kcFormSocialAccountGridItem"
                      )}
                      type="button"
                      href={p.loginUrl}
                    >
                      {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                      <span
                        className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                        dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      }
    >
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password && (
            <form
              onSubmit={() => {
                setIsLoginButtonDisabled(true);
                return true;
              }}
              action={url.loginAction}
              method="post"
              className="space-y-4"
            >
              {!usernameHidden && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">
                    {!realm.loginWithEmailAllowed
                      ? msg("username")
                      : !realm.registrationEmailAsUsername
                        ? msg("usernameOrEmail")
                        : msg("email")}
                  </Label>
                  <Input
                    tabIndex={2}
                    id="username"
                    name="username"
                    defaultValue={login.username ?? ""}
                    type="text"
                    className="bg-black/30 border-orange-500/30 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                    autoFocus
                    autoComplete="username"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                  />
                  {messagesPerField.existsError("username", "password") && (
                    <span
                      id="input-error"
                      className={kcClsx("kcInputErrorMessageClass")}
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                      }}
                    />
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-300">
                  {msg("password")}
                </label>

                <div className="relative">
                  <Input
                    id="password"
                    tabIndex={3}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="bg-black/30 border-orange-500/30 text-gray-100 pr-10 focus:border-orange-500 focus:ring-orange-500"
                    autoComplete="current-password"
                    aria-invalid={messagesPerField.existsError("username", "password")}
                  />
                  {usernameHidden && messagesPerField.existsError("username", "password") && (
                    <span
                      id="input-error"
                      className={kcClsx("kcInputErrorMessageClass")}
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                      }}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-100"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {realm.rememberMe && !usernameHidden && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      tabIndex={5}
                      id="rememberMe"
                      name="rememberMe"
                      defaultChecked={!!login.rememberMe}
                    />
                    <Label htmlFor="remember" className="text-gray-300">{msg("rememberMe")}</Label>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                {realm.resetPasswordAllowed && (
                  <span>
                    <a tabIndex={6} href={url.loginResetCredentialsUrl} className="text-sm text-orange-400 hover:text-orange-300 hover:underline">
                      {msg("doForgotPassword")}
                    </a>
                  </span>
                )}
                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                <Button
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white"
                  tabIndex={7}
                  disabled={isLoginButtonDisabled}
                  name="login"
                  type="submit"
                >
                  {msgStr("doLogIn")}

                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Template>
  );
}

