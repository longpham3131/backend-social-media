import FormInput from "../../../compoents/Form/Input";

const Register = () => {
  return (
    <form>
      <FormInput type={"text"} label={"Tài khoản"} validate={"username"} />
      <FormInput type={"email"} label={"Email"} validate={"email"} />
      <FormInput type={"password"} label={"Mật khẩu"} validate={"password"} />
    </form>
  );
};
export default Register;
