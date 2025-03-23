package tree_sitter_talon_list_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-talon-list"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_talon_list.Language())
	if language == nil {
		t.Errorf("Error loading Talon grammar")
	}
}
