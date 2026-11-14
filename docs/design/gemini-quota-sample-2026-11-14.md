# Gemini CLI quota sample (F-080-T03)

F-080-T04 reads Gemini allowance windows the way the harness already reads Codex and Claude ones. It needs one real sample of what the Gemini CLI shows about its quota, so the adapter reads documented fields only.

## Steps

1. In a terminal, print the version:

   ```sh
   gemini --version
   ```

2. Start the CLI in any folder with no private files (`gemini`), send one short prompt such as `say ok`, then type:

   ```text
   /stats
   ```

   If your version also has `/stats model`, run it too.

3. Copy the output of each command. Remove your email address, project or account IDs, then paste it into the chat with the agent working on F-080-T04, or into a comment on this record's PR.

## Expected result

The output names, for each model or quota bucket, the share used or remaining and when it resets. If it shows only token counts and no quota or reset time, say so. F-080-T04 then records that the Gemini CLI exposes no documented quota window, and it is closed without an adapter.
