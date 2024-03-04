 # crypto module is used in encryption/decryption && hashing-salting
 # 1. encryption/decryption
 make data tranformed so noone can understand real data if they do not know the way how to read
 hello => #rsf3@32

 # 2. hashing-salting
 hashing-salting means is also somehow transform data by using some alsgorythm but you can not get original data back
 what you can do is just compare if you have the original data and hash it
 password ==> hash-salting ==> wefdwgrtgdcsegr
 password ==> hash-salting === wefdwgrtgdcsegr ? if twe get same hash value this password is true

=======================================================

# zlib module is used for compreesion
# 3. compression / uncompression
 make data smaller than original one using an algorith
 [001 000, 0010 0010, 0010 0010] ==> [ 1, 0, 10]

=======================================================
# Buffers are used for encoding and decoding
# 4. encoding/decoding
 encoding is the way to represent a data in zeros and ones ( 'hello' => <Buffer 01 00 17> )
 'text' => 001 001
 decoding is oposite to get original data back
 's' ==> encoding ==> 73 in chaarcter set Unicode
 73 => decode utf-8 ==> 's'