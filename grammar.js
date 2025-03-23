module.exports = grammar({
  name: "talon-list",

  extras: ($) => [
    $.comment,
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/,
  ],

  supertypes: ($) => [
    $.declaration,
    $.expression,
    $.number,
    $.statement,
  ],

  externals: ($) => [
    $._newline,
    $._string_start,
    $.string_content,
    $._string_end,
    $.comment,
  ],

  conflicts: ($) => [
    [$.identifier, $.word],
  ],

  rules: {
    source_file: ($) =>
      seq(
        optional($.matches),
        optional($.declarations),
      ),

    comment: ($) => token(/#[^\r\n]*?/),

    // This is declared to avoid lexical precedence issues arising from ambiguity at the beginning
    // of a file between $.word and $.identifier. By declaring a regular expression that is the
    // intersection of both, we enable the parser to backtrack if needed.
    _simple_identifier: ($) => /[A-Za-z][A-Za-z0-9]*/,

    /* Context */

    matches: ($) =>
      seq(
        repeat($.match),
        repeat1("-"),
        $._newline),

    match_modifier: ($) => choice("and", "not"),

    match: ($) =>
      seq(
        field("modifiers", repeat($.match_modifier)),
        field("left", $.identifier),
        ":",
        field("right", $.implicit_string),
        $._newline
      ),



    /* Statements */
    statement: ($) =>
      choice(
        $.assignment_statement,
      ),

    assignment_statement: ($) =>
      seq(
        field("left", $.identifier),
        ":",
        field("right", $.implicit_string),
        $._newline,
      ),

    implicit_assignment_statement: ($) =>
      seq(
        field("expression", $.expression),
        $._newline,
      ),



    /* Identifiers */

    identifier: ($) => choice(
      $._simple_identifier,
      /([A-Za-z_][A-Za-z0-9_]*)(\.[A-Za-z_][A-Za-z0-9_]*)*/,
    ),


    implicit_string: ($) => token(/(\S|\S.*\S)/),

    string: ($) =>
      seq(
        alias($._string_start, '"'),
        repeat(
          choice(
            $.string_escape_sequence,
            alias($._not_escapesequence, $.string_content),
            $.string_content
          )
        ),
        alias($._string_end, '"')
      ),


    _escape_interpolation: ($) =>
      prec(1, choice(alias("{{", "{"), alias("}}", "}"))),

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
});



function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
