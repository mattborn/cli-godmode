# godmode

CLI to automate Next.js project creation and deployment

## how i made this

made it executable with `#!/usr/bin/env node` at the top

added this to package.json:

```
"bin": {
  "godmode": "./godmode.js"
}
```

then installed it globally with `npm install -g .`

## how to use

add `GITHUB_USERNAME=yourname` to `.env.local` in the directory you are running in

then try `godmode your-project-name`

## global dependencies

this expects you to have all of these installed globally:

- `gh` — for destroying GitHub repos
- `git`
- `npm`/`npx`
- `vercel` — for deploying

if you don’t, then use AI to help you install them
