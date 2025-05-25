import { invoke } from "@tauri-apps/api/core";

function makeGitCall(filePath :string, cmd: string): () => Promise<void>  {
    return async () => {
         await invoke('call_git_cmd', { arg : cmd , filePath: filePath });
    }
}

interface GitActionsProps {
  filePath: string;
}


function GitActions({filePath} : GitActionsProps) {
return (
    <div>
        <button type="button" onClick={makeGitCall(filePath, "fetch")}>Fetch</button>
      <button type="button"  onClick={makeGitCall(filePath, "commit")}>Commit</button>
      <button type="button"  onClick={makeGitCall(filePath, "push")}>Push</button>
      <button type="button"  onClick={makeGitCall(filePath, "push --force")}>Push Force</button>
    </div>
  );

}

export default GitActions;