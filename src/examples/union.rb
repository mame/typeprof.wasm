# foo returns a union of Integer and String
def foo
  if rand > 0.5
    1
  else
    "string"
  end
end

x = foo

# Neither Integer nor String can be added
x + 42    # Error!
x + "str" # Error!

# If you branch on `is_a?`
if x.is_a?(Integer)
  # You can add an Integer here
  x + 42
else
  # You can add a String here
  x + "str"
end
