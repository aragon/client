on: push
name: lint and build
jobs:
  lint_and_build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Install node
        uses: actions/setup-node@v1
        with:
          node-version: 10
      - name: npm install, build, and test
        run: |
          npm install
          npm run lint
          npm run build
env:
  CI: true
