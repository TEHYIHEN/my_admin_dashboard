import { AuthPage } from "@refinedev/antd";
import { authCredentials } from "../../providers/auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={false}
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
