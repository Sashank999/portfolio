## File Structures
There will be two files - `randomised_quotes.txt` "Quotes" file and `quotes_indices.bin` "Index" file.

Quotes file will have quotes in a randomised order, with author followed by the quote, separated by a semi colon (";").

Index file will have the index of the byte at which a quote ends in the Quotes file. The first quote starts at the first byte of the Quotes file.
The index of each byte is encoded in the file as a sequence of 3 bytes. The sequence can be decoded into an index (number) as `bytes[0] ** 65536 + bytes[1] ** 256 + bytes[2]`, in a language similar to JavaScript where `**` is the exponentiation operator and arrays have 0-based indexing.

## File Creation Process
1. Fetch quotes from source. Expected format:
  ```json
[
  {
    "author": "<Author name>",
    "text": "<Quote>"
  }
]
```
2. Shuffle the quotes.
3. Write each quote to the Quotes file in the format `<Author>;<Quote>\n`.
  - Use UTF-8 encoding.
  - A new line character (LF, "\n") is mandatory after each line, irrespective of the platform.
4. Initialize a counter to 0.
5. For each quote:
  1. Increment the counter by number of bytes of the format `<Author>;<Quote>\n`.
  2. Create an array that can hold 3 bytes to hold the counter.
  3. Create a copy of the counter for splitting.
  4. Until the counter is > 0:
    1. Divide (integer division) the counter by 256 (one byte).
    2. Prepend the remainder of the operation to the array.
    3. Set the counter to the quotient.
  5. In case the array has less than 3 elements, prepend null bytes to the array until it holds 3 elements.
  6. In case the array has more than 3 elements, then throw error and terminate.
  7. Write the array to Index file.
  8. Restore the counter from the copy for the next iteration.

## Client Approach

Quotes file is assumed to be hosted at `/randomised_quotes.txt` and its corresponding Index file at `/quotes_indices.bin` in a network-accessible location to the client using HTTP.

1. Fetch the size of Index file using a HEAD request.
2. Divide the size by 3 to obtain the number of quotes in the Quotes file.
3. Generate a random integer between 1 and the number of quotes.
4. Multiply the random integer with 3 to obtain the starting index of the quote index in the Index file.
5. Add 5 to the previously obtained product to get the ending index of the quote index in the Index file.
6. Fetch 6 bytes from the Index file with the starting and ending indices specified in the previous steps.
7. Calculate the first 3 bytes as `bytes[0] ** 65536 + bytes[1] ** 256 + bytes[2]` to obtain the starting index of the quote in Quotes file.
8. Calculate the last 3 bytes as `bytes[3] ** 65536 + bytes[4] ** 256 + bytes[5] - 1` to obtain the ending index of the quote in Quotes file, excluding the newline.
9. Fetch the Quotes file for the range obtained in the previous two steps.
10. Decode the obtained data as UTF-8.
11. Split the obtained data using the first instance of semi colon (";").
12. Consume the first part of the split string as author of the quote and the remaining split string as the quote.

