const chars = [
  'Q',
  'q',
  'W',
  'w',
  'E',
  'e',
  'R',
  'r',
  'T',
  't',
  'Y',
  'y',
  'U',
  'u',
  'I',
  'i',
  'O',
  'o',
  'P',
  'p',
  'A',
  'a',
  'S',
  's',
  'D',
  'd',
  'F',
  'f',
  'G',
  'g',
  'H',
  'h',
  'J',
  'j',
  'K',
  'k',
  'L',
  'l',
  'Z',
  'z',
  'X',
  'x',
  'C',
  'c',
  'V',
  'v',
  'B',
  'b',
  'N',
  'n',
  'M',
  'm',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];

export default function generateId(): string {
  let id = '';
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * chars.length);
    const char = chars[index];
    id += char;
  }
  return id;
}
