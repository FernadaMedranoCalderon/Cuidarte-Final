export async function scheduleLocalNotification(title: string, body: string) {
  return {
    id: Date.now().toString(),
    title,
    body,
  };
}
