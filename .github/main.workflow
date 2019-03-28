workflow "Lint and build" {
  on = "push"
  resolves = ["install", "lint", "build"]
}

action "install" {
  uses = "actions/npm@master"
  args = "install"
}

action "lint" {
  needs = "install"
  uses = "actions/npm@master"
  args = "run lint"
}

action "build" {
  needs = "install"
  uses = "actions/npm@master"
  args = "run build"
}