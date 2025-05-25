use std::process::Command;

#[tauri::command]
pub fn run_command(dir: &str, command: &str) -> String {
    let output = if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/C", command])
            .current_dir(dir)
            .output()
            .expect("failed to execute process")
    } else {
        Command::new("sh")
            .arg("-c")
            .arg(command)
            .current_dir(dir)
            .output()
            .expect("failed to execute process")
    };
    let out = String::from_utf8_lossy(&output.stdout).trim().to_string();
    println!("{:?}", out);
    println!(
        "{:?}",
        String::from_utf8_lossy(&output.stderr).trim().to_string()
    );
    println!("{:?}", output.status.code());
    out
}
