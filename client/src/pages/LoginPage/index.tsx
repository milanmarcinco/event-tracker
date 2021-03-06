import { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import isEmail from "validator/lib/isEmail";

import { logIn as logInService } from "../../services/auth";

import useDispatch from "../../hooks/useDispatch";
import { logIn } from "../../store/authSlice";

import styles from "./LoginPage.module.scss";

interface IFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({});

  const onSubmitHandler: SubmitHandler<IFormInputs> = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError(false);

        const data = await logInService(formData);
        const { accessToken, refreshToken, user } = data;

        setLoading(false);

        dispatch(
          logIn({
            accessToken,
            refreshToken,
            user,
          })
        );
      } catch (err: any) {
        setLoading(false);
        setError(err.message);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (error) return setSuccessMessage("");
    setSuccessMessage(location.state?.success);
  }, [location.state, error]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>
        <b>Sign</b> in
      </h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmitHandler)}>
        {error && <p className={styles.errorBanner}>{error}</p>}
        {successMessage && <p className={styles.successBanner}>{successMessage}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            {...register("email", { required: true, validate: (v) => isEmail(v) })}
            disabled={loading}
          />
          {errors.email?.type === "required" && <p className={styles.errorMessage}>Enter your email address</p>}
          {errors.email?.type === "validate" && <p className={styles.errorMessage}>Enter valid email address</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password", { required: true })} disabled={loading} />
          {errors.password?.type === "required" && <p className={styles.errorMessage}>Enter your password</p>}
        </div>

        <div className={styles.buttonsWrapper}>
          <button className={styles.logInBtn} type="submit" disabled={loading}>
            {loading ? "Loading..." : "Log In"}
          </button>
          <Link
            className={styles.signUpLink}
            to="/register"
            style={{
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            or create an account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
