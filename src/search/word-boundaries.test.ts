import {test, expect, not} from "@benchristel/taste"
import {containsAtWordBoundary} from "./word-boundaries"

test("containsAtWordBoundary", {
    "empty contains empty"() {
        expect("", containsAtWordBoundary, "")
    },

    "empty does not contain nonempty"() {
        expect("", not(containsAtWordBoundary), "a")
    },

    "nonempty contains empty"() {
        expect("a", containsAtWordBoundary, "")
    },

    "a string contains itself"() {
        expect("foo bar baz", containsAtWordBoundary, "foo bar baz")
    },

    "a space is a word boundary"() {
        expect(" foo", containsAtWordBoundary, "foo")
    },

    "a newline is a word boundary"() {
        expect("\nfoo", containsAtWordBoundary, "foo")
    },

    "a tab is a word boundary"() {
        expect("\tfoo", containsAtWordBoundary, "foo")
    },

    "punctuation is a word boundary"() {
        expect("foo.bar", containsAtWordBoundary, "bar")
    },

    "letters are not a word boundary"() {
        expect("foobar", not(containsAtWordBoundary), "bar")
    },

    "numbers are not a word boundary"() {
        expect("1bar", not(containsAtWordBoundary), "bar")
    },

    "all matches are considered"() {
        expect("foobar bar", containsAtWordBoundary, "bar")
    },
})