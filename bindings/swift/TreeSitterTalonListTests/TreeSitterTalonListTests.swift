import XCTest
import SwiftTreeSitter
import TreeSitterTalonList

final class TreeSitterTalonListTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_talon_list())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Talon List grammar")
    }
}
