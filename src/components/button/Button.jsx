function Button ({ onClick = () => {}, children, icon }) {
    return (
      <button onClick={onClick} className="linear flex items-center justify-center rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 gap-2">
        {icon && <span>{icon}</span>}
        <span className="hidden sm:block">{children}</span>
      </button>
    );
  }
  
  export default Button;