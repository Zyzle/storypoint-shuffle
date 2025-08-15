# How to contribute

First off, thanks for taking an interest in the project!

## Submitting a pull request

Please submit pull requests to [Storypoint Shuffle](https://github.com/Zyzle/storypoint-shuffle/pull/new/master) with a clear description of the changes you've made. Ensure your commits follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, including a `resolves: #<issue number>` footer if your change relates to an open issue. Please follow the coding conventions (below).

## Coding conventions

This is open source software. Consider the people who will read your code, and make it look nice for them.

### Frontend

- Respect the prettier formatting rules
- Ensure the changes pass eslint rules
- Any changes made that alter the above should detail these alterations and provide a justification (I'm fairly flexible when it comes to these but you may be asked to revise if I dont like them)
- New components should ideally come with their own associated [Storybook](https://storybook.js.org/docs/writing-stories) files
- Any visual changes will need to be approved before merging, this will happen via Chromatic

### Backend

- Please run `cargo fmt` before submitting
- Ensure Rust code passes the configured clippy lints with `cargo clippy`
- As above, changes to either of these policies will be approved or rejected at my digression
