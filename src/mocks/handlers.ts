
import { http, HttpResponse } from 'msw';

export const restHandlers = [
  http.get('/api/users', () => {
    const response: "success" | "error" = "success"; // Change this to "error" to simulate an error response
    if (response === "error") {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
    return HttpResponse.json({
        users: [
            { id: 1, name: 'Taro Yamada' },
            { id: 2, name: 'Hanako Suzuki' },
            { id: 3, name: 'Jiro Tanaka' },
        ]
    }, { status: 200 });
  }),
];