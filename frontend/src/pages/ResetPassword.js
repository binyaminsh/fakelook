import { redirect, useActionData, useNavigation } from "react-router-dom";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import { resetPassword } from "../util/api";

const ResetPassword = () => {
  const data = useActionData();
  const navigation = useNavigation();

  return (
    <ResetPasswordForm
      isSubmitting={navigation.state === "submitting"}
      data={data}
    />
  );
};

export default ResetPassword;

export async function action({ request }) {
  const formData = await request.formData();
  const newPassword = formData.get("password");

  const search = window.location.search;
  const queryParams = new URLSearchParams(search);

  const resetToken = queryParams.get("token");
  const userId = queryParams.get("id");

  try {
    await resetPassword(newPassword, resetToken, userId);
  } catch (error) {
    if (error.response.status === 422) {
      return error;
    }
    throw error;
  }
  return redirect("/auth");
}
