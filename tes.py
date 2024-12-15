
def decimal_to_hexa(decimal):
    hexa = ""
    while decimal != 0:
        remainder = decimal % 16
        if remainder < 10:
            hexa = str(remainder) + hexa
        else:
            hexa = chr(remainder + 55) + hexa
        decimal = decimal // 16
    return hexa

i = 116-97
for char in "abcdefghijklmnopqrstuvwxyz":
    print (char,decimal_to_hexa(ord(char)), decimal_to_hexa(97+i%26))
    i += 1

def hexa_to_decimal(hexa: str):
    decimal = 0
    for i in range(len(hexa)):
        if hexa[i].isdigit():
            decimal += int(hexa[i]) * 16**(len(hexa)-1-i)
        else:
            decimal += (ord(hexa[i])-55) * 16**(len(hexa)-1-i)
    return decimal

print(hexa_to_decimal("74") - hexa_to_decimal("61"))


abjad = "abcdefghijklmnopqrstuvwxyz"

for char in "steik":
    print(char, abjad[(ord(char)-ord("a")+7)%26])
