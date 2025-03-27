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
        optional($.entries),
        // optional($.declarations),
      ),

    comment: ($) => token(/#[^\r\n]*?/),
    newline: $ => /\r?\n|\r/,

    // This is declared to avoid lexical precedence issues arising from ambiguity at the beginning
    // of a file between $.word and $.identifier. By declaring a regular expression that is the
    // intersection of both, we enable the parser to backtrack if needed.
    _simple_identifier: ($) => /[A-Za-z][A-Za-z0-9]*/,

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




    /* Entries */
    entries: ($) => seq($.implicit_entry_expression),
    entry_expression: ($) =>
      choice(
        $.entry_mapped_expression,
        $.implicit_entry_expression,
      ),
    implicit_entry_expression: ($) => seq(field("key", $.implicit_string), $.newline),

    entry_mapped_expression: ($) =>
      seq(
        field("key", $.implicit_string),
        ":",
        field("value", $.implicit_string),
        $.newline,
      ),




    /* Identifiers */

    identifier: ($) => choice(
      $._simple_identifier,
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
