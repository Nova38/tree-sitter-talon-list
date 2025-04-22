module.exports = grammar({
  name: "talon_list",

  extras: ($) => [
    $.comment,
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/,
  ],

  // supertypes: ($) => [
  //   $.declaration,
  //   $.number,
  //   $.statement,
  // ],

  // externals: ($) => [
  //   $._newline,
  //   $._string_start,
  //   $.string_content,
  //   $._string_end,
  //   $.comment,
  // ],

  // conflicts: ($) => [
  //   [$.identifier, $.word],
  // ],

  rules: {
    source_file: ($) =>
      seq(
        optional($.matches),
        optional($.declarations),
      ),

    comment: ($) => token(/#[^\r\n]*?/),
    newline: $ => /\r?\n|\r/,

    // // This is declared to avoid lexical precedence issues arising from
    // // ambiguity at the beginning of a file between $.word and $.identifier.
    // // By declaring a regular expression that is the intersection of both, we
    // // enable the parser to backtrack if needed.
    // _simple_identifier: ($) => /[A-Za-z][A-Za-z0-9]*/,

    // word: ($) => choice(
    //   $._simple_identifier,
    //   /[\p{Letter}\p{Number}][\p{Letter}\p{Number}\-']*/,
    // ),
    /* Context */

    matches: ($) =>
      seq(
        repeat($.match),
        repeat1("-"),
        $.newline
      ),

    match_modifier: ($) => choice("and", "not"),

    match: ($) =>
      seq(
        field("modifiers", repeat($.match_modifier)),
        field("left", $.identifier),
        ":",
        field("right", $.implicit_string),
        $.newline
      ),

    declarations: ($) => repeat1($.declaration),

    declaration: ($) =>
      seq(
        field("left", $.identifier),
        optional(
          seq(
            ":",
            field("right", $.implicit_string),
          )
        )
      ),

    /* Identifiers */

    identifier: ($) => choice(
      /([A-Za-z_][A-Za-z0-9_]*)(\.[A-Za-z_][A-Za-z0-9_]*)*/,
    ),


    implicit_string: ($) => token(/(\S|\S.*\S)/),

    string: ($) =>
      seq(
        '"',
        repeat(
          choice(
            $.string_escape_sequence,
            $._not_escapesequence,
          )
        ),
        '"'
      ),

    string_escape_sequence: ($) =>
      token(
        prec(
          1,
          seq(
            "\\",
            choice(
              /u[a-fA-F\d]{4}/,
              /U[a-fA-F\d]{8}/,
              /x[a-fA-F\d]{2}/,
              /\d{3}/,
              /\r?\n/,
              "'",
              '"',
              "a",
              "b",
              "f",
              "r",
              "n",
              "t",
              "v",
              "\\"
            )
          )
        )
      ),

    _not_escapesequence: ($) => "\\",
  },
}
);


function sep(rule, separator) {
  return optional(sep1(rule, separator));
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}

function sep2(rule, separator) {
  return seq(rule, repeat1(seq(separator, rule)));
}

function repeat2(rule) {
  return seq(rule, repeat1(rule));
}
