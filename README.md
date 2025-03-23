# tree-sitter-talon-list

![GitHub package.json version](https://img.shields.io/github/package-json/v/nova38/tree-sitter-talon-list) ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/nova38/tree-sitter-talon-list) ![npm](https://img.shields.io/npm/v/tree-sitter-talon-list) [![GitHub CI Status](https://github.com/nova38/tree-sitter-talon-list/actions/workflows/ci.yml/badge.svg)](https://github.com/nova38/tree-sitter-talon-list/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/nova38/tree-sitter-talon-list)

Unofficial Talon List file grammar for [tree-sitter]. It is a fork of [tree-sitter-talon](https://github.com/wenkokke/tree-sitter-talon) with some modifications to support the Talon List file format which has a similar header to the Talon Script but has a much simpler body. Its body is similar to a csv file with two columns that uses a `:` to separate them. The first column is the key and the second is the value. If there is only one column in a given line then the key is also the value.

References:

- [Talon Community Wiki - .talon Files][talon-wiki]

Tested with:

- [talonhub/community]
- [AndreasArvidsson/andreas-talon]
- [phillco/talon-axkit]
- [nriley/talon_community]

If you would like to include your Talon user directory as part of the tests, please submit a pull request adding the relevant information to [`script/parse-examples`](script/parse-examples#L32-L37) and this file.

[tree-sitter]: https://github.com/tree-sitter/tree-sitter
[talon-wiki]: https://talon.wiki/customization/talon-files/
[talonhub/community]: https://github.com/talonhub/community
[AndreasArvidsson/andreas-talon]: https://github.com/AndreasArvidsson/andreas-talon
[phillco/talon-axkit]: https://github.com/phillco/talon-axkit
[nriley/talon_community]: https://github.com/nriley/talon_community
