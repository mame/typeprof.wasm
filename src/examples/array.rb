int_ary = [1, 2, 3]
str_ary = int_ary.map {|s| s.to_s }

# Try to hover the following variable;
# it should pop up "Array[String]"
str_ary

# This also passes
str_ary.first + "str"
