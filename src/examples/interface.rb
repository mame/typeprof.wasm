# Returns a "_Fooable" object
obj = Test.create_fooable

# It responds to "foo"
obj.foo

# You can pass obj to Test.accept_fooable
Test.accept_fooable(obj)

# MyFoo instance is accepted as well
Test.accept_fooable(MyFoo.new)

# MyNotFoo instance is not accepted
Test.accept_fooable(MyNotFoo.new)

# A string is not accepted neither
Test.accept_fooable("foo")
