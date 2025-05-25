#[macro_export]
macro_rules! log_format {
    ($($args:tt)*) => {{
        let formatted_string = format!($($args)*);
        println!("{}", formatted_string);
        formatted_string
    }};
}
