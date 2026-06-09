-- Autostart "ts-lsp" whenever vim starts up.
-- Remember to save it in your plugins folder.
local client = vim.lsp.start_client({
	name = "ts-lsp",
	cmd = { "npx", "ts-node", "/home/codp/projs/js/ts-lsp/src/main.ts" },
})

if client then
	vim.api.nvim_create_autocmd("FileType", {
		pattern = "text",
		callback = function()
			vim.lsp.buf_attach_client(0, client)
		end,
	})
else
	vim.notify("ts-lsp failed to start. ")
end

return {}
