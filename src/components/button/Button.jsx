import styles from "./Button.module.css"
export default function CustomButton({children, handleClick, styler = "primary", shadow =false, type = "button"}) {
    return(
        <button
            type={type}
            onClick={handleClick}
            className={`${styles.button}  ${styles[styler]} ${shadow && styles.shadow}`}
        >
            {children}
        </button>
    );
}