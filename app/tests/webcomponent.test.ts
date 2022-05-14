/**
 * Jest Tests
 * =====================
 *
 * @contributors: Mitch Downey [@mitchdowney] <contact@podverse.fm> (https://github.com/mitchdowney)
 *
 * @license: MIT License
 *
 */
import m from "@app/functions/webcomponent";

test("show hello world", async () => {
	const { app } = await m({ text: "hello-world" });
	expect(app()).toBe("hello-world");
});
